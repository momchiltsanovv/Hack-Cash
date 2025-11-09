package app.games;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/memory")
public class MemoryApiController {

    private final GameService gameService;

    @Autowired
    public MemoryApiController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public ResponseEntity<String> startGame(@RequestBody String body) {
        return gameService.callNodeApi("/api/memory/start", HttpMethod.POST, body);
    }

    @PostMapping("/check")
    public ResponseEntity<String> checkMatch(@RequestBody String body) {
        return gameService.callNodeApi("/api/memory/check", HttpMethod.POST, body);
    }

    @GetMapping("/results/{userId}")
    public ResponseEntity<String> getResults(@PathVariable String userId) {
        return gameService.callNodeApi("/api/memory/results/" + userId, HttpMethod.GET, null);
    }
}
