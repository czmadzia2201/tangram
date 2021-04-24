package org.example.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.*;
import java.util.Set;

@Entity(name = "User")
@Table(name = "user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private int id;

    @Column(name = "username")
    private String username;

    @Column(name = "filename")
    private String filename;

    @JsonIgnore
    @Transient
    private MultipartFile icon;

    @Transient
    private String filepath;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="user_solved", joinColumns=@JoinColumn(name="user_id"))
    @Column(name="task")
    private Set<String> solvedTasks;

    public User(){}

    public User(String username, MultipartFile icon, Set<String> solvedTasks) {
        this.username = username;
        this.icon = icon;
        this.solvedTasks = solvedTasks;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<String> getSolvedTasks() {
        return solvedTasks;
    }

    public void setSolvedTasks(Set<String> solvedTasks) {
        this.solvedTasks = solvedTasks;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public MultipartFile getIcon() {
        return icon;
    }

    public void setIcon(MultipartFile icon) {
        this.icon = icon;
    }

    public String getFilepath() {
        return filepath;
    }

    public void setFilepath(String filepath) {
        this.filepath = filepath;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", filename='" + filename + '\'' +
                ", solvedTasks=" + solvedTasks +
                '}';
    }
}
