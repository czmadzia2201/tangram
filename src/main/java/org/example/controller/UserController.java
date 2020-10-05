package org.example.controller;

import org.example.model.User;
import org.example.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
public class UserController {

    @Autowired
    private UserRepo repository;

    @GetMapping("/tangram")
    public String tangramMain() {
        return "tangram";
    }

    @PostMapping("/getuser")
    public ResponseEntity<?> getUser(@Valid @RequestBody String username) {
        List<User> userList = repository.findByUsername(username);
        if(userList.size()==0)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(userList);
    }

    @PostMapping("/saveuser")
    public ResponseEntity<?> createUser(@Valid @RequestBody User user) {
        repository.save(user);
        User userList = repository.findByUsernameAndKeyword(user.getUsername(), user.getKeyword());
        return ResponseEntity.ok(userList);
    }

}
