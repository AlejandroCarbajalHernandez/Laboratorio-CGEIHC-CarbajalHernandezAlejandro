#version 330 core
struct Material
{
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
    float shininess;
};

struct Light
{
    vec3 position;
    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

in vec3 FragPos;
in vec3 Normal;
in vec2 TexCoords;

out vec4 color;

uniform vec3 viewPos;
uniform vec3 lightPos2;
uniform vec3 lightColor2;
uniform Material material;
uniform Light light;
uniform sampler2D texture_diffuse1;

void main()
{
    vec3 textColor = vec3(texture(texture_diffuse1, TexCoords));
   
    // Ambient
    vec3 ambient = light.ambient * textColor;
   
    // Diffuse Luz 1
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(light.position - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = light.diffuse * diff * textColor;
   
    // Specular Luz 1
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = light.specular * (spec * material.specular);
   
    // Diffuse Luz 2
    vec3 lightDir2 = normalize(lightPos2 - FragPos);
    float diff2 = max(dot(norm, lightDir2), 0.0);
    vec3 diffuse2 = lightColor2 * diff2 * textColor;

    // Sumar las luces
    vec3 result = ambient + diffuse + specular + diffuse2;
    color = vec4(result, 1.0f);
}