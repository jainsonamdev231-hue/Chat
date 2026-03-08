import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.awt.event.*;

public class AnimeChatApp {

    public static void main(String[] args) {
        // 1. Setup Frame with a Modern Look
        JFrame frame = new JFrame("NEXUS: ANIME CHAT");
        frame.setSize(450, 650);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null); // Center on screen

        // 2. Theme Colors
        Color bgDark = new Color(15, 15, 25);
        Color accentPink = new Color(255, 0, 247);
        Color accentCyan = new Color(0, 243, 255);
        Color textWhite = new Color(240, 240, 240);

        // 3. Chat Display Area
        JTextArea chatArea = new JTextArea();
        chatArea.setEditable(false);
        chatArea.setBackground(bgDark);
        chatArea.setForeground(textWhite);
        chatArea.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        chatArea.setLineWrap(true);
        chatArea.setWrapStyleWord(true);
        chatArea.setMargin(new Insets(10, 10, 10, 10));

        JScrollPane scroll = new JScrollPane(chatArea);
        scroll.setBorder(BorderFactory.createLineBorder(accentCyan, 1));

        // 4. Input Field (Bottom)
        JTextField messageField = new JTextField();
        messageField.setBackground(new Color(30, 30, 45));
        messageField.setForeground(Color.WHITE);
        messageField.setCaretColor(accentPink);
        messageField.setFont(new Font("Arial", Font.PLAIN, 16));
        messageField.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(60, 60, 80)),
            BorderFactory.createEmptyBorder(10, 10, 10, 10)
        ));

        // 5. Styled Send Button
        JButton sendButton = new JButton("SEND");
        sendButton.setBackground(accentPink);
        sendButton.setForeground(Color.WHITE);
        sendButton.setFocusPainted(false);
        sendButton.setFont(new Font("Orbitron", Font.BOLD, 12));
        sendButton.setPreferredSize(new Dimension(80, 40));

        // 6. Layout Management
        JPanel bottomPanel = new JPanel(new BorderLayout(10, 10));
        bottomPanel.setBackground(bgDark);
        bottomPanel.setBorder(new EmptyBorder(15, 15, 15, 15));
        bottomPanel.add(messageField, BorderLayout.CENTER);
        bottomPanel.add(sendButton, BorderLayout.EAST);

        frame.add(scroll, BorderLayout.CENTER);
        frame.add(bottomPanel, BorderLayout.SOUTH);

        // 7. Logic: Sending Messages
        ActionListener sendAction = new ActionListener() {
            public void actionPerformed(ActionEvent e) {
                String msg = messageField.getText().trim();
                if (!msg.isEmpty()) {
                    chatArea.append(" > YOU: " + msg + "\n");
                    messageField.setText("");
                    
                    // Simple Bot Response (Managed Logic)
                    Timer botTimer = new Timer(800, ev -> {
                        chatArea.append(" < AI-CHAN: Sugu ni iku yo! (Coming soon!)\n\n");
                        chatArea.setCaretPosition(chatArea.getDocument().getLength());
                    });
                    botTimer.setRepeats(false);
                    botTimer.start();
                }
            }
        };

        sendButton.addActionListener(sendAction);
        messageField.addActionListener(sendAction); // Send on Enter key

        // Final UI tweak
        frame.setVisible(true);
    }
}
