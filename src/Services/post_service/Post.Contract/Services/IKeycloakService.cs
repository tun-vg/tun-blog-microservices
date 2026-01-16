using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Post.Contract.Services;

public interface IKeycloakService
{
    Task<T> GetUserByUsername<T>(string username);
}
