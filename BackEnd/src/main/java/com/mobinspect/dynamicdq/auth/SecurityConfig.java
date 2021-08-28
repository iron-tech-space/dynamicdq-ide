package com.mobinspect.dynamicdq.auth;

import com.mobinspect.dynamicdq.auth.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * SecurityConfig.java
 * Date: 20.04.2021
 * Users: av.eliseev
 * Description: Настройки конфигурации аутентификации/авторизации пользователей
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter
{
    @Autowired
    UserService userService;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userService).passwordEncoder(passwordEncoder());
    }

    @Bean("authenticationManager")
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http
            .csrf().disable()
            .authorizeRequests()
                // Доступ только для пользователей с ролью Администратор
//                .antMatchers("/admin/**").hasRole("ADMIN")
//                .antMatchers("/news").hasRole("USER")
                // Доступ разрешен всем пользователей
                .antMatchers("/static/**").permitAll()
                .antMatchers("/login**", "/logout**").permitAll()
                // Все остальные страницы требуют аутентификации
            .anyRequest().authenticated()
            .and()
                .httpBasic()
            .and()
                .formLogin()
                .loginPage("/login")
                .successHandler(new AuthenticationSuccess())
                .failureHandler(new AuthenticationFailure())
                .permitAll()
            .and()
                .logout()
                .logoutUrl("/logout")
                .deleteCookies("JSESSIONID")
                .permitAll();

        http.exceptionHandling().authenticationEntryPoint(new AuthenticationEntryPointImpl());
        // Необходимо для получения списка активных сессий
//        http.sessionManagement().sess
        //            .authorizeRequests()
//                .antMatchers(
//                        "/login",
//                        "/bootstrap-4.3.1/**",
//                        "/css/**",
//                        "/img/**",
//                        "/oauth/authorize").permitAll()
    }


    @Bean(name = "passwordEncoder")
    public PasswordEncoder passwordEncoder()
    {
        // в БД хранятся пароли в виде хэшей BCrypt
        return new BCryptPasswordEncoder();
    }
}
