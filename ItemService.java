package com.example.demo.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.example.demo.model.Item;
import com.example.demo.repository.ItemRepository;

@Service
public class ItemService {
    private final ItemRepository repo;
    public ItemService(ItemRepository repo) { this.repo = repo; }

    public List<Item> getAll() { return repo.findAll(); }
    public Optional<Item> getById(Long id) { return repo.findById(id); }
    public Item save(Item item) { return repo.save(item); }
    public void delete(Long id) { repo.deleteById(id); }
}
