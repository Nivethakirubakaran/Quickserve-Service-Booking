package com.example.quick_service.repository;

import com.example.quick_service.model.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByCityIgnoreCase(String city);
    List<ServiceItem> findByPostalCode(String postalCode);
    List<ServiceItem> findByNameContainingIgnoreCase(String name);
    List<ServiceItem> findByProviderNameContainingIgnoreCase(String providerName);
    List<ServiceItem> findTop10ByOrderByRatingDesc();
}
