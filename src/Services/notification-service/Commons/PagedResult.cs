namespace NotificationService.Commons;

public class PagedResult<T>
{
    public int PageNumber { get; set; } = 1;

    public int PageSize { get; set; } = 10;
    
    public int TotalCount { get; set; }
    
    public int TotalPages { get; set; }

    public List<T> Items { get; set; }
    
    public int CountUnreadNotify { get; set; }

    public PagedResult()
    {

    }

    public PagedResult(int pageNumber, int pageSize, int totalCount, List<T> items, int countUnreadNotify)
    {
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalCount = totalCount;
        TotalPages = (int)Math.Ceiling((double)totalCount / pageSize);
        Items = items;
        CountUnreadNotify = countUnreadNotify;
    }

    public static PagedResult<T> Create(int pageNumber, int pageSize, int totalCount, List<T> items, int countUnreadNotify)
    {
        return new PagedResult<T>(pageNumber, pageSize, totalCount, items, countUnreadNotify);
    }
}
