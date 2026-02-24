package com.example.quick_service.controller;

import com.example.quick_service.dto.ServiceDTO;
import com.example.quick_service.service.ServiceListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    private final ServiceListingService serviceListingService;

    public ServiceController(ServiceListingService serviceListingService) {
        this.serviceListingService = serviceListingService;
    }

    @GetMapping("/search")
    public ResponseEntity<List<ServiceDTO>> search(@RequestParam(required = false) String place) {
        List<ServiceDTO> list = serviceListingService.findByPlace(place);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/home")
    public ResponseEntity<List<ServiceDTO>> home() {
        List<ServiceDTO> list = serviceListingService.findByPlace(null);
        return ResponseEntity.ok(list);
    }
}
