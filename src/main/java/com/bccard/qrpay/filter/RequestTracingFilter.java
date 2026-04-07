package com.bccard.qrpay.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

@Slf4j
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestTracingFilter extends OncePerRequestFilter {
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    private static final String MDC_KEY = "correlationId";

    private static final String TRANSACTION_ID_HEADER = "X-Transaction-ID";
    private static final String TRANSACTION_ID_COOKIE = "X-Transaction-ID";
    private static final String TRANSACTION_MDC_KEY = "transactionId";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Correlation ID 생성 및 MDC 설정 (요청 단위 추적)
        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }
        MDC.put(MDC_KEY, correlationId);
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        // 2. Transaction ID 설정 (세션 단위 추적) - 헤더 → 쿠키 → 신규 생성 순으로 확인
        String transactionId = request.getHeader(TRANSACTION_ID_HEADER);
        if (transactionId == null || transactionId.isEmpty()) {
            transactionId = extractFromCookie(request, TRANSACTION_ID_COOKIE);
        }
        if (transactionId == null || transactionId.isEmpty()) {
            transactionId = UUID.randomUUID().toString();
        }
        MDC.put(TRANSACTION_MDC_KEY, transactionId);
        response.setHeader(TRANSACTION_ID_HEADER, transactionId);
        ResponseCookie transactionCookie = ResponseCookie.from(TRANSACTION_ID_COOKIE, transactionId)
                .httpOnly(true)
                .path("/")
                .sameSite("Strict")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, transactionCookie.toString());

        // 3. 바디 캐싱을 위한 Wrapper 적용
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);
        try {
            filterChain.doFilter(requestWrapper, responseWrapper);
        } finally {
            // 4. 응답 바디를 실제 응답 스트림에 복사 (필수!)
            responseWrapper.copyBodyToResponse();
            MDC.clear();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return !path.startsWith("/qrpay/api/")
                && !path.startsWith("/pages/")
                && !path.startsWith("/auth/")
                && !path.startsWith("/qrpay/auth/");
    }

    private String extractFromCookie(HttpServletRequest request, String cookieName) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private void printHeaders(ContentCachingRequestWrapper contentCachingRequestWrapper) {

        log.info("Method = {}", contentCachingRequestWrapper.getMethod());
        log.info("requestURI = {}", contentCachingRequestWrapper.getRequestURI());
        log.info("queryString = {}", contentCachingRequestWrapper.getQueryString());

        List<String> blackList = Arrays.asList("authorization", "cookie", "proxy-authorization");
        Enumeration<String> headerNames = contentCachingRequestWrapper.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String name = headerNames.nextElement();
            String value = contentCachingRequestWrapper.getHeader(name);
            log.info("===== Header = {} : {}", name, value);
        }
    }

    private void printBody(ContentCachingResponseWrapper contentCachingResponseWrapper) {
        String bodyString = new String(contentCachingResponseWrapper.getContentAsByteArray(), StandardCharsets.UTF_8);
        log.info("===== Body: {}", bodyString);
    }
}