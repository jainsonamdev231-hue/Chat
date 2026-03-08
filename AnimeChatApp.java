import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class AnimeChatApp {

    public static void main(String[] args) {

        JFrame frame = new JFrame("Anime Chat App");
        frame.setSize(400,600);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Background panel with anime wallpaper
        JLabel background = new JLabel(new ImageIcon("anime.jpg"));
        background.setLayout(new BorderLayout());

        // Chat area
        JTextArea chatArea = new JTextArea();
        chatArea.setEditable(false);
        chatArea.setFont(new Font("Arial", Font.PLAIN, 14));
        JScrollPane scroll = new JScrollPane(chatArea);

        // Input field
        JTextField messageField = new JTextField();

        // Send button
        JButton sendButton = new JButton("Send");

        JPanel bottomPanel = new JPanel(new BorderLayout());
        bottomPanel.add(messageField, BorderLayout.CENTER);
        bottomPanel.add(sendButton, BorderLayout.EAST);

        background.add(scroll, BorderLayout.CENTER);
        background.add(bottomPanel, BorderLayout.SOUTH);

        frame.setContentPane(background);

        // Send message action
        sendButton.addActionListener(new ActionListener(){
            public void actionPerformed(ActionEvent e){

                String msg = messageField.getText();

                if(!msg.equals("")){
                    chatArea.append("You: " + msg + "\n");
                    messageField.setText("");
                }
            }
        });

        frame.setVisible(true);
    }
}