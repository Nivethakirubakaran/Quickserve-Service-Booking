package com.example.quick_service.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private String postalCode;
    private String providerName;
    private Double price;
    private Double rating;
}
