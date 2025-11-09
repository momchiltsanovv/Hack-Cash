package app.games.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class RewardRequest {
    private UUID userId;
    private int points;
}
