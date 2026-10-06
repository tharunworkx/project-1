package com.expensemanagement.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "application.security.jwt")
public class JwtConfig {

    private String secretKey = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
    private long expiration = 86400000; // 24 hours in milliseconds
    private long refreshExpiration = 604800000; // 7 days in milliseconds

    public String getSecretKey() {
        return secretKey;
    }

    public void setSecretKey(String secretKey) {
        this.secretKey = secretKey;
    }

    public long getExpiration() {
        return expiration;
    }

    public void setExpiration(long expiration) {
        this.expiration = expiration;
    }

    public long getRefreshExpiration() {
        return refreshExpiration;
    }

    public void setRefreshExpiration(long refreshExpiration) {
        this.refreshExpiration = refreshExpiration;
    }
}
