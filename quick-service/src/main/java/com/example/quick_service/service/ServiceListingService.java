package com.example.quick_service.service;

import com.example.quick_service.dto.ServiceDTO;
import com.example.quick_service.model.ServiceItem;
import com.example.quick_service.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceListingService {
    private final ServiceRepository serviceRepository;

    public ServiceListingService(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    public List<ServiceDTO> findByPlace(String place) {
        List<ServiceItem> items;
        if (place == null || place.isBlank()) {
            items = serviceRepository.findTop10ByOrderByRatingDesc();
        } else if (place.matches("\\\\d+")) {
            // numeric -> postal code
            items = serviceRepository.findByPostalCode(place);
        } else {
            // try city first, then name/provider fallback
            items = serviceRepository.findByCityIgnoreCase(place);
            if (items.isEmpty()) {
                items = serviceRepository.findByNameContainingIgnoreCase(place);
            }
            if (items.isEmpty()) {
                items = serviceRepository.findByProviderNameContainingIgnoreCase(place);
            }
        }

        return items.stream().map(it -> new ServiceDTO(it.getId(), it.getName(), it.getDescription(), it.getAddress(), it.getCity(), it.getPostalCode(), it.getProviderName(), it.getPrice(), it.getRating())).collect(Collectors.toList());
    }
}
