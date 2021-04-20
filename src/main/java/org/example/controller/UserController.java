package org.example.controller;

import org.example.model.User;
import org.example.repo.UserRepo;
import org.example.service.FileSystemStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Controller
public class UserController {

    @Autowired
    private UserRepo repository;

    @Autowired
    private FileSystemStorageService storageService;

    @Value("${dirName}")
    private String dirName;

    @GetMapping("/tangram")
    public String tangramMain() {
        return "tangram";
    }

    @PostMapping("/getuser")
    public ResponseEntity<?> getUser(@RequestBody String username) {
        List<User> userList = repository.findByUsername(username);
        if(userList.size()==0)
            return ResponseEntity.notFound().build();
        userList.forEach(user -> user.setFilepath("/" + dirName + "/" + user.getFilename()));
        return ResponseEntity.ok(userList);
    }

    @PostMapping("/createuser")
    public ResponseEntity<?> createUser(
            @RequestParam("createUname") String username,
            @RequestParam("file") MultipartFile icon,
            @RequestParam("solvedTasks") Set<String> solvedTasks) throws IOException {
        User user = new User(username, icon, solvedTasks);
        String filename = storageService.store(user);
        user.setFilename(filename);
        repository.save(user);
        User userList = repository.findByUsernameAndFilename(user.getUsername(), user.getFilename());
        userList.setFilepath("/" + dirName + "/" + user.getFilename());
        return ResponseEntity.ok(userList);
    }

    @PostMapping("/updateuser")
    public ResponseEntity<?> updateUser(
            @RequestParam("id") int id,
            @RequestParam("solvedTasks") Set<String> solvedTasks) {
        User user = repository.findById(id).get();
        user.setSolvedTasks(solvedTasks);
        repository.save(user);
        return ResponseEntity.ok(user);
    }

}
