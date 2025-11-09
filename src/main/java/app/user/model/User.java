package app.user.model;

import app.subscription.model.Subscription;
import app.wallet.model.Wallet;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String profilePictureURL;

    @Column(unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Country country;

    private boolean active;

    @Column(nullable = false,
            updatable = false)
    @CreationTimestamp
    private LocalDateTime createdOn;

    @Column(nullable = false)
    @UpdateTimestamp
    private LocalDateTime updatedOn;

    @OrderBy("createdOn DESC")
    @OneToMany(fetch = FetchType.EAGER,
               mappedBy = "owner")
    private List<Subscription> subscriptions = new ArrayList<>();

    @OrderBy("createdOn ASC")
    @OneToMany(fetch = FetchType.EAGER,
               mappedBy = "owner")
    private List<Wallet> wallets = new ArrayList<>();

    @Column(nullable = false)
    @ColumnDefault("0")
    private int points;

}
