package edu.ssw590.summitwealthbank.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class WealthActionRequest {
    private Long accountId;
    private String action; // "buy" or "sell"
    private BigDecimal amount;
}