package app.games.controller;

import app.games.model.MemorySession;
import app.games.service.MemoryService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/memory")

public class MemoryController {

    private final MemoryService memoryService;

    public MemoryController(MemoryService memoryService) {
        this.memoryService = memoryService;
    }

    @PostMapping("/start")
    public MemorySession start(@AuthenticationPrincipal UserDetails user) {
        try {
            String userId = user.getUsername();
            return memoryService.startGame(userId);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }


    @PostMapping("/check")
    public MemorySession check(@AuthenticationPrincipal UserDetails user,
                               @RequestBody Map<String, Integer> payload) {
        String userId = user.getUsername();
        int index1 = payload.get("index1");
        int index2 = payload.get("index2");
        return memoryService.checkMatch(userId, index1, index2);
    }
    @GetMapping("/results/{userId}")
    public Map<String, Object> results(@PathVariable String userId) {
        MemorySession session = memoryService.getResults(userId);
        Map<String, Object> response = new HashMap<>();
        response.put("coins", session.getCoins());
        response.put("tries", session.getTries());
        response.put("finished", session.isFinished(memoryService.totalPairs()));
        return response;
    }
}
