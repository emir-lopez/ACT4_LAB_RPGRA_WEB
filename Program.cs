// Servidor estatico minimo. Sirve index.html, css/ y js/ desde la carpeta del proyecto.
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "."
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.Run();
