using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Post.Contract.Repositories;
using Post.Domain.Entities;

namespace Post.Persistence.Repositories;

public class CategoryRepository : ICategoryRepository
{
    private readonly ApplicationDBContext _context;

    public CategoryRepository(ApplicationDBContext context)
    {
        _context = context;
    }

    public async Task<(List<Category>, int)> GetAll()
    {
        var categories = await _context.Categories.ToListAsync();
        int count = categories.Count;
        return (categories, count);
    }

    public async Task<Category> GetById(Guid id)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
        {
            throw new Exception($"Category with ID {id} not found.");
        }
        return category;
    }

    public async Task<List<Category>> SearchCategoryByName(string name)
    {
        var categories = await _context.Categories.Where(c => c.Name.Contains(name)).ToListAsync();
        return categories;
    }

    public async Task CreateCategory(Category category)
    {
        await _context.Categories.AddAsync(category);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateCategory(Category category)
    {
        _context.Categories.Update(category);
        await _context.SaveChangesAsync();
    }

    public Task DeleteCategory(Guid id)
    {
        var category = _context.Categories.Find(id);
        if (category == null)
        {
            throw new Exception($"Category with ID {id} not found.");
        }
        else
        {
            _context.Categories.Remove(category);
            return _context.SaveChangesAsync();
        }
    }
}