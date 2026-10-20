
package uis.edu.entornos.tienda.modelo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = Proveedor.TABLE_NAME)
public class Proveedor {

    public static final String TABLE_NAME = "proveedor";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 120)
    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    @NotBlank(message = "El NIT es obligatorio")
    @Size(max = 30)
    @Column(name = "nit", nullable = false, unique = true, length = 30)
    private String nit;

    @Size(max = 100)
    @Column(name = "contacto", length = 100)
    private String contacto;

    @Size(max = 20)
    @Column(name = "telefono", length = 20)
    private String telefono;

    @Email(message = "El email no es válido")
    @Size(max = 150)
    @Column(name = "email", length = 150)
    private String email;

    @Size(max = 200)
    @Column(name = "direccion", length = 200)
    private String direccion;
}
