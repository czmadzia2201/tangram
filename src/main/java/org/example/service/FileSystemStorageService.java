package org.example.service;

import org.example.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class FileSystemStorageService {

	private Path uploadDir;

	public FileSystemStorageService(@Value("${dirName}") String dirName) {
		uploadDir = Paths.get(dirName);
	}

	public String store(User user) throws IOException {
		if (!Files.exists(uploadDir)) {
			Files.createDirectories(uploadDir);
		}

		if (user.getIcon().isEmpty()) {
			throw new IOException("Failed to store empty file.");
		}

		String filename = createFileName(user.getIcon().getOriginalFilename(), user.getUsername());

		try (InputStream inputStream = user.getIcon().getInputStream()) {
			Path destinationFile = uploadDir.resolve(filename);
			Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
		} catch (IOException e) {
			throw new IOException("Failed to store file.", e);
		}
		return filename;
	}

	private String createFileName(String filename, String username) {
		DateFormat df = new SimpleDateFormat("yyyyMMdd-HHmmSS");
		return username + "-" + df.format(new Date()) + "." + getFileExtension(filename);
	}

	private String getFileExtension(String filename) {
		return filename.contains(".") ? filename.substring(filename.lastIndexOf(".") + 1) : null;
	}

}