package app.web.dto;

import app.user.model.Country;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank
    @Size(min = 6, max = 26, message = "Username length must be between 6 and 26 symbols.")
    private String username;

    @NotBlank(message = "Password is required")
    @Pattern(regexp = "^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?])(?=.*[a-zA-Z]).{8,}$",
             message = "Password must contain at least 1 uppercase letter, 1 digit, 1 special character, and be at least 8 characters long"
    )
    private String password;

    @NotNull
    private Country country;
}
