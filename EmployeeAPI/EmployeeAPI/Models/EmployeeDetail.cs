using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EmployeeAPI.Models
{
    public class EmployeeDetail
    {
        [Key]
        public int EmployeeDetailId { get; set; }
        [Column(TypeName ="nvarchar(20)")]
        public string FirstName { get; set; } = "";
        [Column(TypeName = "nvarchar(20)")]
        public string LastName { get; set; } = "";
        public int Age { get; set; } 
        public float Salary { get; set; }

    }
}
