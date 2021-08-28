package com.mobinspect.dynamicdq.auth.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.util.Assert;

public class UserRole implements GrantedAuthority {

    private String role;

    public UserRole() {}

    public UserRole(String role) {
        Assert.hasText(role, "A granted authority textual representation is required");
        this.role = role;
    }

    public void setAuthority(String role) {
        Assert.hasText(role, "A granted authority textual representation is required");
        this.role = role;
    }

    @Override
    public String getAuthority() {
        return role;
    }
}
