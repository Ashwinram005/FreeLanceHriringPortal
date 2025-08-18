package com.examly.springapp.controller;

import com.examly.springapp.dto.FileDTO;
import com.examly.springapp.service.FileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/files")
@CrossOrigin(origins = "*")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    
    @PostMapping
    public FileDTO createFile(@RequestBody FileDTO dto) {
        return fileService.createFile(dto);
    }

    // New file upload endpoint
    @PostMapping("/upload")
    public FileDTO uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("projectId") Long projectId
    ) throws IOException {
        return fileService.uploadFile(file, projectId);
    }

    @GetMapping
    public List<FileDTO> getAllFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/{id}")
    public FileDTO getFileById(@PathVariable Long id) {
        return fileService.getFileById(id);
    }

    @PutMapping("/{id}")
    public FileDTO updateFile(@PathVariable Long id, @RequestBody FileDTO dto) {
        return fileService.updateFile(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deleteFile(@PathVariable Long id) {
        fileService.deleteFile(id);
    }

    @GetMapping("/project/{projectId}")
    public List<FileDTO> getFilesByProject(@PathVariable Long projectId) {
        return fileService.getFilesByProjectId(projectId);
    }
}
