using Post.Domain.Entities;

namespace Post.Contract.Repositories;

public interface ICategoryRepository
{
    Task<(List<Category>, int)> GetAll();
    
    Task<Category> GetById(Guid id);
    
    Task<List<Category>> SearchCategoryByName(string name);
    
    Task CreateCategory(Category category);
    
    Task UpdateCategory(Category category);
    
    Task DeleteCategory(Guid id);
}