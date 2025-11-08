package app.wallet.model;

import app.user.model.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Currency;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne
    private User owner;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private WalletStatus status;

    @Column(nullable = false)
    private BigDecimal balance;

    @Column(nullable = false)
    @ColumnDefault("0.00")
    private BigDecimal cashback;

    @Column(nullable = false)
    private Currency currency;

    private boolean main;

    @Column(nullable = false)
    @CreationTimestamp
    private LocalDateTime createdOn;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedOn;
}
