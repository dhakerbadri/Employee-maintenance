using Microsoft.EntityFrameworkCore;

namespace EmployeeAPI.Models
{
    public class EmployeeDetailContext : DbContext
    {
        public EmployeeDetailContext(DbContextOptions<EmployeeDetailContext> options) : base(options)
        {
        }
        public DbSet<EmployeeDetail> EmployeeDetails { get; set; }
    }
}
