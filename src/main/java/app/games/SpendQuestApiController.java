package app.games;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/spendquest")
public class SpendQuestApiController {

    private final GameService gameService;

    @Autowired
    public SpendQuestApiController(GameService gameService) {
        this.gameService = gameService;
    }

    // Match GET /level/:id to load scenario
    @GetMapping("/level/{id}")
    public ResponseEntity<String> getLevel(@PathVariable int id) {
        return gameService.callNodeApi("/api/spendquest/level/" + id, HttpMethod.GET, null);
    }

    // Match POST /choose to submit choice
    @PostMapping("/choose")
    public ResponseEntity<String> chooseOption(@RequestBody String body) {
        return gameService.callNodeApi("/api/spendquest/choose", HttpMethod.POST, body);
    }
}
