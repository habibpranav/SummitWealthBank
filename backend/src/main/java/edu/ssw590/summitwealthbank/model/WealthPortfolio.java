package edu.ssw590.summitwealthbank.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WealthPortfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long accountId;

    private BigDecimal stockPercentage;
    private BigDecimal bondPercentage;

    private BigDecimal stockUnits;
    private BigDecimal bondUnits;
}