package app.games.controller;

import app.games.dto.RewardRequest;
import app.user.model.User;
import app.user.service.UserPointsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/games")
public class GameRewardController {

    private final UserPointsService pointsService;

    public GameRewardController(UserPointsService pointsService) {
        this.pointsService = pointsService;
    }

    @PostMapping("/reward")
    public User rewardPoints(@RequestBody RewardRequest request) {
        // Delegates everything to the service
        return pointsService.addPoints(request.getUserId(), request.getPoints());
    }
}
