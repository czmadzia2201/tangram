package org.example.repo;

import org.example.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepo extends CrudRepository<User, Integer> {

    List<User> findByUsername(String username);

    User findByUsernameAndFilename(String username, String filename);

}
