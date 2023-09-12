using EmployeeAPI.Helpers;
using EmployeeAPI.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.Messaging;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;

namespace EmployeeAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserContext _userContext;
        public UserController(UserContext userContext)
        {
            _userContext = userContext;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] User userObj)
        {
            if (userObj == null)
                return BadRequest();
            var user = await _userContext.Users.
                FirstOrDefaultAsync(x => x.UserName== userObj.UserName);

            if (user == null)
                return NotFound(new {Message = "User Not Found!"});
            if(!PasswordHasher.VerifyPassword(userObj.Password,user.Password))            
                return BadRequest(new { Message = "Password is Incorrect!" });

            user.Token = CreateJwt(user);

            return Ok(new
            {   Token = user.Token,
                Message = "Login Success!"
            });
               
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] User userObj)
        {
            if (userObj==null)
                return BadRequest();

            //Check username
            if(await CheckUserNameExistAsync(userObj.UserName))
               return BadRequest(new {Message = "Username already exists !"});

            //Check email
            if (await CheckEmailNameExistAsync(userObj.Email))
                return BadRequest(new { Message = "Email already exists !" });

            //Check password
            var pass = CheckPasswordStrength(userObj.Password);
            if (!string.IsNullOrEmpty(pass))
                return BadRequest(new {Message = pass.ToString()});


            userObj.Password = PasswordHasher.HashPassword(userObj.Password);
            userObj.Role = "User";
            userObj.Token = CreateJwt(userObj);
            await _userContext.Users.AddAsync(userObj);
            await _userContext.SaveChangesAsync();
            return Ok(new
            {
                Message = "User Registered!"
            });
        }

        private Task<bool> CheckUserNameExistAsync (string username) 
            =>_userContext.Users.AnyAsync(x => x.UserName == username);
        private Task<bool> CheckEmailNameExistAsync(string email)
            => _userContext.Users.AnyAsync(x => x.Email == email);
        private string CheckPasswordStrength(string password)
        {
            StringBuilder sb = new StringBuilder();
            if (password.Length < 8)
                sb.Append("Minimum password length should be 8 " + Environment.NewLine);
            if (!(Regex.IsMatch(password, "[a-z]") && Regex.IsMatch(password, "[A-Z]")
                && Regex.IsMatch(password, "[0-9]")))
                sb.Append("Password should be Alphanumeric" + Environment.NewLine);
            if(!Regex.IsMatch(password,"[<,>,@,!,#,$,%,&,*,(,),_,+,\\[,\\],{,},?,:,;,|,',.,/,=,-]"))
                sb.Append("Password should contain special characters"+ Environment.NewLine);
            return sb.ToString();
        }
        private string CreateJwt(User user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role,user.Role),
                new Claim(ClaimTypes.Name,$"{user.UserName}")
            });
            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials,
            };
            var token = jwtTokenHandler.CreateToken(tokenDescriptor);

            return jwtTokenHandler.WriteToken(token);
        }
    }
}
