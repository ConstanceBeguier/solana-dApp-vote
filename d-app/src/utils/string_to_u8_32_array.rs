/// Convertit une chaîne de caractères en un tableau de bytes de taille fixe [u8; 32].
/// Remplit les places restantes avec des zéros si la chaîne est plus courte que la taille du tableau.
pub fn string_to_u8_32_array(input: &str) -> Result<[u8; 32], &'static str> {
    log::info!("input : {}", input);
    if input.is_empty() {
        return Err("string_to_u8_32_array cannot be empty.");
    }
    let mut array = [0u8; 32]; // Crée un tableau de 32 zéros
    let bytes = input.as_bytes();
    for (i, &byte) in bytes.iter().enumerate().take(32) {
        array[i] = byte;
    }
    Ok(array)
}
