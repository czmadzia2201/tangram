package org.example.model;

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

    @Column(name = "keyword")
    private String keyword;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name="user_solved", joinColumns=@JoinColumn(name="user_id"))
    @Column(name="task")
    private Set<String> solvedTasks;

    public User(){};

    public User(String username, String keyword) {
        this.username = username;
        this.keyword = keyword;
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

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Set<String> getSolvedTasks() {
        return solvedTasks;
    }

    public void setSolvedTasks(Set<String> solvedTasks) {
        this.solvedTasks = solvedTasks;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", keyword='" + keyword + '\'' +
                ", solvedTasks=" + solvedTasks +
                '}';
    }
}
