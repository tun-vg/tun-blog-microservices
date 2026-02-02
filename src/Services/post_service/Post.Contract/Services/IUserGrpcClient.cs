namespace Post.Contract.Services;

public interface IUserGrpcClient
{
    
    Task<object> SearchUsers(string name);
    
}