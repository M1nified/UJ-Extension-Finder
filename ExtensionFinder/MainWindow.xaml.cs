using ExtensionFinder.Db;
using ExtensionFinder.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ExtensionFinder
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        List<Extension> extensions = new List<Extension>();
        Db.Db db = Db.Db.GetDb;

        public MainWindow()
        {
            InitializeComponent();

            var l = db.List;

            dataGrid.ItemsSource = l;

        }

        private void UpdateView()
        {
            dataGrid.ItemsSource = db.List.FindAll(x => x.Name.Contains(filterBox.Text));
        }

        private void TextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            UpdateView();
        }

        private void newSave_Click(object sender, RoutedEventArgs e)
        {
            var extension = new Extension(-1, newName.Text, newDescription.Text);
            db.Add(extension);
            UpdateView();
        }
    }
}
