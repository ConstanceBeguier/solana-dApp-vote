pub fn bytes_to_string(bytes: &[u8]) -> String {
    let valid_bytes = bytes.iter().take_while(|&&b| b != 0).copied().collect::<Vec<u8>>();
    String::from_utf8_lossy(&valid_bytes).to_string()
}