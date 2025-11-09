package app.ai.client;

import app.ai.model.AIRequest;
import app.ai.model.AIResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "aiClient", url = "http://localhost:5051")
public interface AIClientFeign {

    @PostMapping("/api/chat")
    ResponseEntity<AIResponse> sendMessageToAI(@RequestBody AIRequest request);
}
