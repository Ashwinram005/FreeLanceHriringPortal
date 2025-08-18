package com.examly.springapp.service;

import com.examly.springapp.dto.FileDTO;
import com.examly.springapp.model.File;
import com.examly.springapp.model.Project;
import com.examly.springapp.repository.FileRepository;
import com.examly.springapp.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FileService {

    private final FileRepository fileRepository;
    private final ProjectRepository projectRepository;

    public FileService(FileRepository fileRepository, ProjectRepository projectRepository) {
        this.fileRepository = fileRepository;
        this.projectRepository = projectRepository;
    }

    public FileDTO createFile(FileDTO dto) {
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        File file = new File();
        file.setProject(project);
        file.setFileName(dto.getFileName());
        file.setFileUrl(dto.getFileUrl());

        File saved = fileRepository.save(file);
        return mapToDTO(saved);
    }

    
    public FileDTO uploadFile(MultipartFile multipartFile, Long projectId) throws IOException {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

       
        String uploadDir = "uploads/";
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        Path filePath = uploadPath.resolve(multipartFile.getOriginalFilename());
        Files.write(filePath, multipartFile.getBytes());

        // Save file metadata in DB
        File file = new File();
        file.setProject(project);
        file.setFileName(multipartFile.getOriginalFilename());
        file.setFileUrl(filePath.toString()); // Local path

        File saved = fileRepository.save(file);
        return mapToDTO(saved);
    }

    public List<FileDTO> getAllFiles() {
        return fileRepository.findAll().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public FileDTO getFileById(Long id) {
        return fileRepository.findById(id)
                .map(this::mapToDTO)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    public FileDTO updateFile(Long id, FileDTO dto) {
        File file = fileRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("File not found"));

        file.setFileName(dto.getFileName());
        file.setFileUrl(dto.getFileUrl());

        return mapToDTO(fileRepository.save(file));
    }

    public void deleteFile(Long id) {
        fileRepository.deleteById(id);
    }

    public List<FileDTO> getFilesByProjectId(Long projectId) {
        return fileRepository.findAll().stream()
                .filter(f -> f.getProject().getId().equals(projectId))
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private FileDTO mapToDTO(File file) {
        return new FileDTO(
                file.getId(),
                file.getProject().getId(),
                file.getFileName(),
                file.getFileUrl()
        );
    }
}
