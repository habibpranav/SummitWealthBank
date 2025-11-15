package edu.ssw590.summitwealthbank.controller;

import edu.ssw590.summitwealthbank.dto.AdminActionRequest;
import edu.ssw590.summitwealthbank.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/freeze")
    public void freeze(@RequestBody AdminActionRequest request) {
        adminService.freezeAccount(request);
    }

    @PostMapping("/unfreeze")
    public void unfreeze(@RequestBody AdminActionRequest request) {
        adminService.unfreezeAccount(request);
    }
}