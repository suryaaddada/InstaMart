namespace Backend.Interface
{
    public interface IJWTToken
    {
        object Authenticate(string email,string role);
    }
}
