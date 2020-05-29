namespace Data.Dtos
{
    public class PhotoForUpdateDto
    {
        public string Url { get; set; }
        public string Description { get; set; }
        public bool IsMain { get; set; } = false;
        public bool Status { get; set; } = false;
    }
}