using EmployeeTaskApi.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeTaskApi.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Employee
        modelBuilder.Entity<Employee>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.FullName).IsRequired().HasMaxLength(100);
            e.Property(x => x.Email).IsRequired().HasMaxLength(150);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Salary).HasColumnType("decimal(18,2)");
        });

        // TaskItem
        modelBuilder.Entity<TaskItem>(t =>
        {
            t.HasKey(x => x.Id);
            t.Property(x => x.Title).IsRequired().HasMaxLength(200);
            t.Property(x => x.Status).HasConversion<string>();
            t.Property(x => x.Priority).HasConversion<string>();
            t.HasOne(x => x.Employee)
             .WithMany(e => e.Tasks)
             .HasForeignKey(x => x.EmployeeId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // User
        modelBuilder.Entity<User>(u =>
        {
            u.HasKey(x => x.Id);
            u.Property(x => x.Username).IsRequired().HasMaxLength(50);
            u.Property(x => x.Email).IsRequired().HasMaxLength(150);
            u.HasIndex(x => x.Email).IsUnique();
            u.Property(x => x.Role).HasConversion<string>();
        });
    }
}
