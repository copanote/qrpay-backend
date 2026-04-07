package com.bccard.qrpay.aop;

import com.bccard.qrpay.domain.log.QrpayLog;
import com.bccard.qrpay.domain.log.QrpayLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;
import org.springframework.web.util.WebUtils;

@Slf4j
@Aspect
@Component
@RequiredArgsConstructor
public class ApiLogAspect {

    private static final List<String> HEADER_MASK_LIST =
            Arrays.asList("authorization", "cookie", "proxy-authorization");

    private final QrpayLogService apiLogService;

    /** REST API: 요청 + 응답 모두 저장 */
    @Around("execution(* com.bccard.qrpay.controller.api..*.*(..))")
    public Object logRestApi(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = getRequest();
        HttpServletResponse response = getResponse();

        Throwable error = null;
        try {
            return joinPoint.proceed();
        } catch (Throwable t) {
            error = t;
            throw t;
        } finally {
            String responseBody = error != null ? error.getMessage() : extractResponseBody(response);
            QrpayLog qrpayLog = QrpayLog.restApiLog(
                    apiLogService.getId(),
                    MDC.get("correlationId"),
                    request.getRequestURI(),
                    String.valueOf(response.getStatus()),
                    extractRequestInfo(request),
                    responseBody);
            apiLogService.saveApiLog(qrpayLog);
        }
    }

    /** Pages API: 요청만 저장 (HTML 응답 제외) */
    @Around("execution(* com.bccard.qrpay.controller.page..*.*(..))")
    public Object logPageRequest(ProceedingJoinPoint joinPoint) throws Throwable {
        HttpServletRequest request = getRequest();
        HttpServletResponse response = getResponse();

        try {
            return joinPoint.proceed();
        } finally {
            QrpayLog qrpayLog = QrpayLog.pageRequestLog(
                    apiLogService.getId(),
                    MDC.get("correlationId"),
                    request.getRequestURI(),
                    String.valueOf(response.getStatus()),
                    extractRequestInfo(request));
            apiLogService.saveApiLog(qrpayLog);
        }
    }

    private HttpServletRequest getRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
    }

    private HttpServletResponse getResponse() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
    }

    private String extractRequestInfo(HttpServletRequest request) {
        return request.getQueryString() + "|" + extractHeaders(request) + "|" + extractRequestBody(request);
    }

    private String extractHeaders(HttpServletRequest request) {
        Map<String, String> headerMap = new HashMap<>();
        Enumeration<String> names = request.getHeaderNames();
        while (names.hasMoreElements()) {
            String name = names.nextElement();
            String value = HEADER_MASK_LIST.contains(name.toLowerCase()) ? "***" : request.getHeader(name);
            headerMap.put(name, value);
        }
        return headerMap.toString();
    }

    private String extractRequestBody(HttpServletRequest request) {
        ContentCachingRequestWrapper wrapper = WebUtils.getNativeRequest(request, ContentCachingRequestWrapper.class);
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) return new String(buf, StandardCharsets.UTF_8);
        }
        return "";
    }

    private String extractResponseBody(HttpServletResponse response) {
        ContentCachingResponseWrapper wrapper =
                WebUtils.getNativeResponse(response, ContentCachingResponseWrapper.class);
        if (wrapper != null) {
            byte[] buf = wrapper.getContentAsByteArray();
            if (buf.length > 0) return new String(buf, StandardCharsets.UTF_8);
        }
        return "";
    }
}
