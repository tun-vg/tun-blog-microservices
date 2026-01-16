namespace UserService.Commons;

public class KeycloakConfiguration
{
    public string Realm { get; set; } = string.Empty;
    public string ClientId { get; set; } = string.Empty;
    public string ClientSecret { get; set; } = string.Empty;
    public string KeycloakUrl { get; set; } = string.Empty;
}
