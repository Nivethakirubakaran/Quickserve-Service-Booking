package com.example.quick_service.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "service_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;
    // place-based location fields
    private String address;
    private String city;
    private String postalCode;

    private String providerName;

    private Double price;

    private Double rating;
}
