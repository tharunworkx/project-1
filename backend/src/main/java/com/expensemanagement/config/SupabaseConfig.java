package com.expensemanagement.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "supabase")
public class SupabaseConfig {

    private String url = "https://sugnjvihcclgiffmixcc.supabase.co";
    private String publishableKey = "sb_publishable_SWV5OEiqjRqWKX4P5xASzg_G37I529S";
    private String serviceRoleKey;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublishableKey() {
        return publishableKey;
    }

    public void setPublishableKey(String publishableKey) {
        this.publishableKey = publishableKey;
    }

    public String getServiceRoleKey() {
        return serviceRoleKey;
    }

    public void setServiceRoleKey(String serviceRoleKey) {
        this.serviceRoleKey = serviceRoleKey;
    }
}
