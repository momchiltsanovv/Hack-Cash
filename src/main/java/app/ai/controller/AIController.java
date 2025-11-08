package app.ai.controller;

import app.ai.model.AIRequest;
import app.ai.model.AIResponse;
import app.ai.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ai")
public class AIController {

    private final AIService aiService;

    @Autowired
    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<AIResponse> chatWithAI(@RequestBody AIRequest request) {
        AIResponse aiResponse = aiService.chatWithAI(request);
        return new ResponseEntity<>(aiResponse, HttpStatus.OK);
    }
}
