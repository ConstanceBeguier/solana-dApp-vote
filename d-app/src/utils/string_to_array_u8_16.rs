
/// Convertit une chaîne de caractères en un tableau de bytes de taille fixe [u8; 16].
/// Remplit les places restantes avec des zéros si la chaîne est plus courte que la taille du tableau.
pub fn string_to_array_u8_16(input: &str) -> Result<[u8; 16], &'static str>  {
    log::info!("input : {}", input);
    if input.is_empty() {
        return Err("string_to_array_u8_16 cannot be empty.");
    }
    let mut array = [0u8; 16]; // Crée un tableau de 16 zéros
    let bytes = input.as_bytes();
    for (i, &byte) in bytes.iter().enumerate().take(16) {
        array[i] = byte;
    }
    Ok(array)
}
